import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/jobs',
    permanent: false
  }
});

const IndexPage = () => null;

export default IndexPage;
