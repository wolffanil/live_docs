"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSelf } from "@liveblocks/react/suspense";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import { findUser } from "@/lib/actions/user.actions";
import toast from "react-hot-toast";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");

  const shareDocumentHandler = async () => {
    if (!email) return;
    setLoading(true);

    if (collaborators?.some((c) => c?.email === email)) {
      toast.error("Пользователь уже есть в документе");
      setLoading(false);
      return;
    }

    try {
      await findUser(email);
    } catch (error) {
      toast.error("Пользователя не существует");
      setLoading(false);
      return;
    }

    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: {
        ...user.info,
        name:
          user.info.name?.split(" ")[0] == "null"
            ? "пользователь"
            : user.info.name,
      },
    });

    toast.success("Пользователь добавлен в документ");
    setEmail("");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={currentUserType !== "editor"}>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4"
          disabled={currentUserType !== "editor"}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Делиться</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>
            Определите, кто может просматривать этот проект
          </DialogTitle>
          <DialogDescription>
            Выберите, какие пользователи могут получить доступ к этому проекту и
            просматривать его.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Введите адрес электронной почты"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-blue flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Приглашсить"}
          </Button>
        </div>

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
