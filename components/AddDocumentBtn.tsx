"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function AddDocumentBtn({ userId, email }: AddDocumentBtnProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const AddDocumentHandler = () => {
    startTransition(async () => {
      const room = await createDocument({ userId, email });

      if (room) router.push(`/documents/${room.id}`);
    });
  };

  return (
    <Button
      type="submit"
      onClick={AddDocumentHandler}
      className="gradient-blue flex gap-1 shadow-md"
      disabled={isPending}
    >
      {!isPending ? (
        <>
          <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
          <p className="hidden sm:block">Запуск чистого документа</p>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </Button>
  );
}

export default AddDocumentBtn;
