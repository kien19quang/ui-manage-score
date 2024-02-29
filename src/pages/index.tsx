import { ERole } from '@/models/common';
import { Flex, Modal, Typography } from 'antd';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Flex>Hello</Flex>
  );
};

export default Home

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }

  if (session.role === ERole.student) {
    return {
      redirect: {
        destination: '/student/register-study',
        permanent: false,
      }
    }
  }

  if (session.role === ERole.admin) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      }
    }
  }

  if (session.role === ERole.teacher) {
    console.log(session)
    return {
      redirect: {
        destination: '/teacher',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}