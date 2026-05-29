{{/* Expand the name of the chart. */}}
{{- define "cronjob.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Create a default fully qualified app name. */}}
{{- define "cronjob.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "cronjob.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "cronjob.labels" -}}
helm.sh/chart: {{ include "cronjob.chart" . }}
{{ include "cronjob.selectorLabels" . }}
{{ include "cronjob.recommendedLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "cronjob.selectorLabels" -}}
app: {{ include "cronjob.fullname" . }}
{{- end }}

{{- define "cronjob.recommendedLabels" -}}
app.kubernetes.io/name: {{ include "cronjob.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "cronjob.scheme" -}}
{{- if eq (toString .Values.cronjobConfig.disableHttps) "true" -}}http{{- else -}}https{{- end -}}
{{- end }}

{{- define "cronjob.port" -}}
{{- $scheme := include "cronjob.scheme" . -}}
{{- $port := toString .Values.cronjobConfig.cloudPort -}}
{{- if eq $scheme "http" -}}
{{- $port = toString .Values.cronjobConfig.httpPort -}}
{{- end -}}
{{- if or (and (eq $scheme "https") (or (eq $port "") (eq $port "443"))) (and (eq $scheme "http") (or (eq $port "") (eq $port "80"))) -}}
{{- "" -}}
{{- else -}}
{{- $port -}}
{{- end }}
{{- end }}

{{- define "cronjob.portSuffix" -}}
{{- $port := include "cronjob.port" . -}}
{{- if $port -}}:{{ $port }}{{- end -}}
{{- end }}

{{- define "cronjob.portEnv" -}}
{{- $port := include "cronjob.port" . -}}
{{- if $port -}}:{{ $port }}{{- end -}}
{{- end }}

{{- define "cronjob.cloudOrigin" -}}
{{- include "cronjob.scheme" . -}}://{{ .Values.cronjobConfig.cloudDomain }}{{ include "cronjob.portSuffix" . }}
{{- end }}

{{- define "cronjob.wildcardCloudOrigin" -}}
{{- include "cronjob.scheme" . -}}://*.{{ .Values.cronjobConfig.cloudDomain }}{{ include "cronjob.portSuffix" . }}
{{- end }}

{{- define "cronjob.host" -}}
{{- default (printf "cronjob.%s" .Values.cronjobConfig.cloudDomain) .Values.ingress.host -}}
{{- end }}

{{- define "cronjob.appUrl" -}}
{{- include "cronjob.scheme" . -}}://{{ include "cronjob.host" . }}{{ include "cronjob.portSuffix" . }}
{{- end }}
