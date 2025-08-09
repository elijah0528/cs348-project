import React from 'react';
import AppLayout from '../components/AppLayout';
import Input from '../components/ui/input';
import Button from '../components/ui/button';

const NewFormPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log('Form submitted:', Object.fromEntries(formData));
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">New Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input id="name" name="name" type="text" required className="mt-1" />
          </div>
          <Button type="submit" className="mt-4">Submit</Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default NewFormPage;