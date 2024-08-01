import Head from 'next/head';
import Navbar from '@/components/Nav';
import ObjectLocalization from "@/components/ObjectLocalization";

const PredictPage = () => {
  return (
    <>
      <Head>
        <title>Predict</title>
        <meta name="description" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
      </Head>
      <Navbar />
      <ObjectLocalization />
    </>
  );
}

export default PredictPage;

