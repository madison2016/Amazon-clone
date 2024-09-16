import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./index.css";

import { IMAGES } from "../../configurations/amazon_images";

function SignUp() {
    const {
        register,
        formState,
        reset,
        watch,
        getValues,
        formState: { errors, isSubmitSuccessful },
        handleSubmit,
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset({
                password: "",
                password_repeat: "",
                name:"",
                email:""
            });
        }
    }, [formState, reset]);

    return (
        <div className="signup">
            <img className="hide-bg image" src={IMAGES.amazonLogoForPages} alt="logo" />
            <div className="form-border">
                <header>Create account</header>
                <div className="form">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="name">Your name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="First and last name"
                            {...register("name", {
                                required: "Name is required",
                            })}
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name && (
                            <p role="alert" className="text-error">
                                {errors.name?.message}
                            </p>
                        )}
                        <label htmlFor="name">Mobile number or email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter email or phone number"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.name && (
                            <p role="alert" className="text-error">
                                {errors.name?.message}
                            </p>
                        )}
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="At least 6 characters"
                            {...register(
                                "password",
                                { required: "password is required" },
                                { maxLength: 2 }
                            )}
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && (
                            <p role="alert" className="text-error">
                                {errors.password?.message}
                            </p>
                        )}
                        <label htmlFor="password_repeat">
                            Re-enter password
                        </label>
                        <input
                            type="password"
                            name="password_repeat"
                            {...register("password_repeat", {
                                required: {
                                    value: true,
                                    message: "required to confirm password",
                                },
                            })}
                            aria-invalid={
                                errors.password_repeat ? "true" : "false"
                            }
                        />

                        {errors.password && (
                            <p role="alert" className="text-error">
                                {errors.password_repeat?.message}
                            </p>
                        )}
                        {watch("password_repeat") !== watch("password") &&
                        getValues("password_repeat") ? (
                            <p className="text-error">password not match</p>
                        ) : null}<br/>
                        <button>Continue</button>
                    </form>
                    <p className="legal-info">
                        By creating an account, you agree to Amazon's{" "}
                        <a href="#">Conditions of Use</a> and{" "}
                        <a href="#">Privacy Notice</a>
                    </p>
                    <div className="divider"></div>
                    <p className="register">
                        Already have an account? <a href="#">Sign in</a>
                    </p>
                    <p className="buyforwork">
                        Buying for work?{" "}
                        <a href="#">Create a free business account</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
