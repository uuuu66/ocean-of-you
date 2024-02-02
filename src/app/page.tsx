"use client";
import IconInput from "@/components/atoms/IconInput/IconInput";
import Image from "next/image";
import { iconPaths } from "../../public/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-2/3 bg-white fixed top-5">
        <IconInput
          $inputSize="xl"
          $isIconOpenButton
          $isIconLeft
          $inputType="secondary"
          $submitButton={{ Icon: iconPaths.Loading }}
        />
        <IconInput
          $inputSize="lg"
          $isIconOpenButton
          $isIconLeft
          $submitButton={{ Icon: iconPaths.Loading }}
        />
        <IconInput
          $inputSize="md"
          $isIconOpenButton
          $isIconLeft
          $submitButton={{
            Icon: iconPaths.Loading,
            iconAnimationType: "rotate",
          }}
        />
        <IconInput
          $inputSize="sm"
          $isIconOpenButton
          $isIconLeft
          $submitButton={{ Icon: iconPaths.Loading }}
        />
        <IconInput
          $inputSize="xs"
          $isIconOpenButton
          $isIconLeft
          $submitButton={{ Icon: iconPaths.Loading }}
        />
      </div>
    </main>
  );
}
