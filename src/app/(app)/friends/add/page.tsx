"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { customFetch } from "@/lib/custom-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

  const handleSubmit = useCallback(
    async ({ email }: AddFriendSchema) => {
      const response = await customFetch.post("/api/friends/requests", {
        email,
      });

      form.reset();

      if (!response.ok) {
        return toast.error((await response.json()).error);
      }

      return toast.success(`Friend request sent to ${email}`);
    },
    [form],
  );

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
