"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { safeFetch } from "@/lib/safe-fetch";
import { socket } from "@/lib/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FullFriendship } from "@/types/db-model-types";

const addFriendSchema = z.object({
  email: z.email(),
});

type AddFriendSchema = z.infer<typeof addFriendSchema>;

export default function FriendsAddPage() {
  const form = useForm({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleSubmit({ email }: AddFriendSchema) {
    const result = await safeFetch.post<FullFriendship>(
      "/api/friends/requests",
      {
        email,
      },
    );

    form.reset();

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    socket.emit("friendshipRequest", result.data);

    toast.success(`Friend request sent to ${email}`);
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <div className="flex flex-row gap-4">
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="example@example.com"
                required
              />
              <Button type="submit" className="hover:cursor-pointer">
                Send Friend Request
              </Button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
