import React, { useState, useEffect } from "react";
import { z, ZodSchema } from "zod";

interface WithValidationProps {
  schema: ZodSchema;
  onSubmit: (data: any) => void;
  initialData?: { [key: string]: any };
}

const withValidation = (WrappedComponent: React.ComponentType<any>) => {
  return ({
    schema,
    onSubmit,
    initialData = {},
    ...props
  }: WithValidationProps) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(
      initialData
    );
    const [error, setError] = useState<string>("");

    useEffect(() => {
      setFormData(initialData);
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      const result = schema.safeParse(formData);
      if (!result.success) {
        setError(result.error.errors[0]?.message ?? "Invalid input");
        return;
      }
      setError("");
      onSubmit(formData);
    };

    return (
      <>
        <WrappedComponent
          {...props}
          formData={formData}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </>
    );
  };
};

export default withValidation;
