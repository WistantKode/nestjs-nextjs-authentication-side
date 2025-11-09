"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { signUp } from "@/lib/auth";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Définition du schéma de validation avec Zod, en miroir du CreateUserDto du backend
const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  // Renforcement de la politique de mot de passe, comme discuté
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

// Inférence du type à partir du schéma Zod pour une sécurité de type de bout en bout
type SignUpFormValues = z.infer<typeof SignUpSchema>;

const SignUpForm = () => {
  // useFormState gère toujours la communication avec la Server Action
  const [state, action] = useFormState(signUp, undefined);

  // 2. react-hook-form gère l'état du formulaire et la validation côté client
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema), // Utilisation du resolver Zod
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 3. La fonction onSubmit n'est appelée que si la validation client réussit
  const onSubmit = (data: SignUpFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    action(formData);
  };

  return (
    // handleSubmit pré-valide le formulaire avant d'appeler notre onSubmit
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-4">
        {/* Erreur générale du serveur (ex: email déjà utilisé) */}
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div>
          <Label htmlFor="name">Name</Label>
          {/* 4. Enregistrement de l'input avec react-hook-form */}
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
          />
          {/* Affichage instantané de l'erreur de validation client */}
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        
        {/* Le SubmitButton utilisera `useFormStatus` pour connaître l'état de pending */}
        <SubmitButton>Sign Up</SubmitButton>
      </div>
    </form>
  );
};

export default SignUpForm;
