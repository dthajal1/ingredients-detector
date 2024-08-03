import Head from 'next/head';
import Navbar from '@/components/Nav';
import LandingPage from '../components/Landing';

const Homepage = () => {
  return (
    <>
      <Head>
        <title>Ingredients Detector</title>
        <meta name="description" content="Ingredients Detector helps you identify ingredients from images and generate recipes effortlessly." />
        <meta property="og:title" content="Ingredients Detector" />
        <meta property="og:description" content="Snap a photo or upload images of your ingredients, and let Ingredients Detector do the rest. Identify ingredients, manage your list, and generate recipes with ease." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ingredients-detector.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <LandingPage />
    </>
  );
}

export default Homepage;

