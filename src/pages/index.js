import LabelDetection from "@/components/LabelDetection";
import ObjectLocalization from "@/components/ObjectLocalization";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>Google Cloud Vision API Label Detection</h1>
      {/* <LabelDetection /> */}
      <ObjectLocalization />
    </div>
  );
}

