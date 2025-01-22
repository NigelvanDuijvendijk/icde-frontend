import { Form, Input, Button } from "@nextui-org/react";
import React, { FormEvent } from "react";
import './loginForm.css';
import { AuthenticationToken, Ontwikkelaar } from '@/app/types/types';
import { login } from "@/app/apiService";
import { useAuth } from "@/app/contexts/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(null);
  const { user, setUser, authenticationToken, setAuthenticationToken } = useAuth();
  const router = useRouter()

  const onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined = (e: any) => {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
    
      e.preventDefault();
      const ontwikkelaar: Partial<Ontwikkelaar> = {
          email: data.Email.toString(),
          hashedPassword: data.Wachtwoord.toString()  
      }  

      login(ontwikkelaar).then((token: AuthenticationToken) => {
        setAuthenticationToken(token);
        setUser(ontwikkelaar);
        router.push('/onderwijseenheden');
      });
  }

    return (
      <div className="login_box p-3 bg-current">
        <h1 className="display-6 mb-3">Login</h1>
        <Form
          className="w-full justify-center items-center w-full space-y-6"
          validationBehavior="native"
          validationErrors={errors}
          onReset={() => setSubmitted(null)}
          onSubmit={onSubmit}
          id="loginForm"
          >
                    <Input
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een email in";
                            }

                            return "Email is incorrect";
                        }}
                        label="Email"
                        labelPlacement="outside"
                        name="Email"
                        placeholder="Voer een email in"
                    />
                    <Input
                      type="password"
                        isRequired
                        errorMessage={({validationDetails}) => {
                            if (validationDetails.valueMissing) {
                            return "Voer een wachtwoord in";
                            }

                            return "Wachtwoord is incorrect";
                        }}
                        label="Wachtwoord"
                        labelPlacement="outside"
                        name="Wachtwoord"
                        placeholder="Voer een wachtwoord in"
                    />
            </Form>
            <Button
              type="submit"
              form="loginForm"
              color="primary"
              className="w-full mt-3">
                Login
            </Button>
      </div>
    );
  };