"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema, registerSchema } from "@/schemas/auth";

type AuthMode = "login" | "register";

type Props = {
  mode: AuthMode;
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const { login, register, getDashboardPath } = useAuth();

  const schema = useMemo(
    () => (mode === "login" ? loginSchema : registerSchema),
    [mode],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            avatarUrl: "",
            role: "CUSTOMER",
          },
  });

  const isRegister = mode === "register";

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const session = isRegister
        ? await register(values as Parameters<typeof register>[0])
        : await login(values as Parameters<typeof login>[0]);
      toast.success(
        isRegister ? "Account created successfully" : "Logged in successfully",
      );
      router.push(getDashboardPath(session.user.role));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  });

  return (
    <Card className="overflow-hidden border-white/60 bg-white/90 backdrop-blur">
      <CardHeader className="space-y-3 border-b border-border/60 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          FixItNow access
        </CardDescription>
        <CardTitle className="text-3xl tracking-tight text-slate-950">
          {isRegister ? "Create your account" : "Sign in to continue"}
        </CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          {isRegister
            ? "Join as a customer, technician, or admin and manage bookings from one place."
            : "Access your role-based dashboard, booking history, and payment flow."}
        </p>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form className="space-y-5" onSubmit={onSubmit}>
          {isRegister ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Aisha Rahman"
                  {...form.register("name")}
                />
                {form.formState.errors.name ? (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+8801000000001"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone ? (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.phone.message}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {isRegister ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword ? (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://..."
                  {...form.register("avatarUrl")}
                />
                {form.formState.errors.avatarUrl ? (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.avatarUrl.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "role",
                      value as "CUSTOMER" | "TECHNICIAN" | "ADMIN",
                    )
                  }
                  defaultValue="CUSTOMER"
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Optional note</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about your needs or profile"
                  disabled
                />
              </div>
            </>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isRegister ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            className="font-medium text-sky-700 hover:underline"
            href={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Sign in" : "Create one"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
