import Head from 'next/head';
import Navbar from '@/components/Nav';
import Landing from '@/components/Landing';

const Homepage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>
      <Navbar />
      <Landing />
    </>
  );
}

export default Homepage;
