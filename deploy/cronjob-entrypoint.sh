#!/bin/bash
set -e

SERVICE_NAME=${SERVICE_NAME:-"cronjob"}
RELEASE_NAME=${RELEASE_NAME:-"${SERVICE_NAME}"}
RELEASE_NAMESPACE=${RELEASE_NAMESPACE:-"${SERVICE_NAME}"}
CHART_PATH=${CHART_PATH:-"./charts/${SERVICE_NAME}"}
OLD_SERVICE_NAME="cronjob-frontend"
OLD_RELEASE_NAME="cronjob-frontend"
OLD_RELEASE_NAMESPACE="cronjob-frontend"
OLD_USER_VALUES_PATH="/root/.sealos/cloud/values/core/${OLD_SERVICE_NAME}-values.yaml"
USER_VALUES_PATH="/root/.sealos/cloud/values/apps/${SERVICE_NAME}/${SERVICE_NAME}-values.yaml"
HELM_OPTS=${HELM_OPTS:-""}
HELM_OPTIONS=${HELM_OPTIONS:-""}
AUTO_CONFIG_HELM_OPTS=""

get_cm_value() {
  local namespace="$1"
  local name="$2"
  local key="$3"
  kubectl get configmap "${name}" -n "${namespace}" -o "jsonpath={.data.${key}}" 2>/dev/null || true
}

add_set_string() {
  local key="$1"
  local value="$2"
  if [ -n "${value}" ]; then
    AUTO_CONFIG_HELM_OPTS="${AUTO_CONFIG_HELM_OPTS} --set-string ${key}=${value}"
  fi
}

normalize_user_values_header() {
  local file="$1"
  [ -f "${file}" ] || return 0

  sed -i \
    -e 's/cronjob-frontend helm chart/cronjob helm chart/g' \
    -e 's/This file contains user-customizable configurations./This file only contains fields users commonly tune./g' \
    "${file}"
}
read_cert_tls_reject_unauthorized() {
    local cert_mode

    cert_mode="$(kubectl get configmap cert-config -n sealos-system -o jsonpath='{.data.CERT_MODE}' 2>/dev/null || true)"
    cert_mode="${CERT_MODE:-${cert_mode:-self-signed}}"
    cert_mode="$(printf '%s' "${cert_mode}" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"

    case "${cert_mode}" in
        https|acme|acmedns) printf '0' ;;
        *) printf '1' ;;
    esac
}


SEALOS_CLOUD_DOMAIN=${SEALOS_CLOUD_DOMAIN:-"${cloudDomain:-$(get_cm_value sealos-system sealos-config cloudDomain)}"}
add_set_string cronjobConfig.cloudDomain "${SEALOS_CLOUD_DOMAIN}"
SEALOS_CLOUD_PORT=${SEALOS_CLOUD_PORT:-"${cloudPort:-$(get_cm_value sealos-system sealos-config cloudPort)}"}
add_set_string cronjobConfig.cloudPort "${SEALOS_CLOUD_PORT}"
SEALOS_HTTP_PORT=${SEALOS_HTTP_PORT:-"${httpPort:-$(get_cm_value sealos-system sealos-config httpPort)}"}
add_set_string cronjobConfig.httpPort "${SEALOS_HTTP_PORT}"
SEALOS_DISABLE_HTTPS=${SEALOS_DISABLE_HTTPS:-"${disableHttps:-$(get_cm_value sealos-system sealos-config disableHttps)}"}
add_set_string cronjobConfig.disableHttps "${SEALOS_DISABLE_HTTPS}"
SEALOS_CERT_SECRET_NAME=${SEALOS_CERT_SECRET_NAME:-"${certSecretName:-$(get_cm_value sealos-system sealos-config certSecretName)}"}
add_set_string cronjobConfig.certSecretName "${SEALOS_CERT_SECRET_NAME}"
tlsRejectUnauthorized="$(read_cert_tls_reject_unauthorized)"
add_set_string cronjobConfig.tlsRejectUnauthorized "${tlsRejectUnauthorized:-}"

adopt_namespaced_resource() {
  local namespace="$1"
  local kind="$2"
  local name="$3"
  if kubectl -n "${namespace}" get "${kind}" "${name}" >/dev/null 2>&1; then
    echo "Adopting ${kind} ${namespace}/${name}..."
    kubectl -n "${namespace}" label "${kind}" "${name}" app.kubernetes.io/managed-by=Helm --overwrite >/dev/null 2>&1 || true
    kubectl -n "${namespace}" annotate "${kind}" "${name}" meta.helm.sh/release-name="${RELEASE_NAME}" meta.helm.sh/release-namespace="${RELEASE_NAMESPACE}" --overwrite >/dev/null 2>&1 || true
  fi
}

adopt_cluster_resource() {
  local kind="$1"
  local name="$2"
  if kubectl get "${kind}" "${name}" >/dev/null 2>&1; then
    echo "Adopting ${kind} ${name}..."
    kubectl label "${kind}" "${name}" app.kubernetes.io/managed-by=Helm --overwrite >/dev/null 2>&1 || true
    kubectl annotate "${kind}" "${name}" meta.helm.sh/release-name="${RELEASE_NAME}" meta.helm.sh/release-namespace="${RELEASE_NAMESPACE}" --overwrite >/dev/null 2>&1 || true
  fi
}

delete_legacy_cronjob_frontend() {
  if helm status "${OLD_RELEASE_NAME}" -n "${OLD_RELEASE_NAMESPACE}" >/dev/null 2>&1; then
    echo "Uninstalling legacy Helm release ${OLD_RELEASE_NAMESPACE}/${OLD_RELEASE_NAME}..."
    helm uninstall "${OLD_RELEASE_NAME}" -n "${OLD_RELEASE_NAMESPACE}" --wait --timeout 5m || true
  fi

  if kubectl get namespace "${OLD_RELEASE_NAMESPACE}" >/dev/null 2>&1; then
    echo "Deleting legacy namespace ${OLD_RELEASE_NAMESPACE}..."
    kubectl delete namespace "${OLD_RELEASE_NAMESPACE}" --ignore-not-found --wait=true --timeout=5m || true
  fi

  if [ "${OLD_USER_VALUES_PATH}" != "${USER_VALUES_PATH}" ] && [ ! -f "${USER_VALUES_PATH}" ] && [ -f "${OLD_USER_VALUES_PATH}" ]; then
    echo "Migrating legacy user values to ${USER_VALUES_PATH}..."
    mkdir -p "$(dirname "${USER_VALUES_PATH}")"
    cp "${OLD_USER_VALUES_PATH}" "${USER_VALUES_PATH}"
  fi

  if [ -f "${OLD_USER_VALUES_PATH}" ]; then
    echo "Removing legacy user values ${OLD_USER_VALUES_PATH}..."
    rm -f "${OLD_USER_VALUES_PATH}"
  fi
}

delete_legacy_cronjob_frontend

echo "Checking and adopting existing resources..."
if kubectl get namespace "${RELEASE_NAMESPACE}" >/dev/null 2>&1; then
  kubectl label namespace "${RELEASE_NAMESPACE}" app.kubernetes.io/managed-by=Helm --overwrite >/dev/null 2>&1 || true
  kubectl annotate namespace "${RELEASE_NAMESPACE}" meta.helm.sh/release-name="${RELEASE_NAME}" meta.helm.sh/release-namespace="${RELEASE_NAMESPACE}" --overwrite >/dev/null 2>&1 || true

  adopt_namespaced_resource "${RELEASE_NAMESPACE}" configmap cronjob-config
  adopt_namespaced_resource "${RELEASE_NAMESPACE}" service cronjob
  adopt_namespaced_resource "${RELEASE_NAMESPACE}" deployment cronjob
  adopt_namespaced_resource "${RELEASE_NAMESPACE}" ingress cronjob
fi

adopt_namespaced_resource app-system apps.app.sealos.io cronjob

if [ ! -f "${USER_VALUES_PATH}" ]; then
  mkdir -p "$(dirname "${USER_VALUES_PATH}")"
  cp "./charts/cronjob/cronjob-values.yaml" "${USER_VALUES_PATH}"
fi
normalize_user_values_header "${USER_VALUES_PATH}"

HELM_ARGS="${AUTO_CONFIG_HELM_OPTS} ${HELM_OPTIONS} ${HELM_OPTS}"

echo "Deploying Helm chart..."
helm upgrade -i "${RELEASE_NAME}" -n "${RELEASE_NAMESPACE}" --create-namespace "${CHART_PATH}" \
  -f "./charts/cronjob/values.yaml" \
  -f "${USER_VALUES_PATH}" \
  ${HELM_ARGS}
