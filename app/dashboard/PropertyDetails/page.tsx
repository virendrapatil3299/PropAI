"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, MapPin, DollarSign, Image, Info } from "lucide-react";
<<<<<<< HEAD
import DashboardLayout from "../SavedPage/layout";
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b

export default function SellPropertyPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    latitude: "",
    longitude: "",
    contact: "",
    type: "Residential",
    listingStatus: "For Sale",
    homeType: "",
    size: "",
    plotArea: "",
    baths: "",
    beds: "",
    price: "",
    images: [] as File[],
  });

  const [loading, setLoading] = useState(false);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) =>
          !formData.images.some(
            (existingFile) =>
              existingFile.name === file.name && existingFile.size === file.size
          )
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  const getAiPriceSuggestion = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/price-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to fetch AI price");
      const data = await res.json();
      setAiSuggestedPrice(data.price);
    } catch (err) {
      console.error("AI Price Error:", err);
      alert("Failed to get AI price suggestion");
    }
    setLoadingAI(false);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.address.trim()) {
      alert("Please fill in at least the title and address");
      return;
    }
    setLoading(true);
    try {
      const imagesURLs = formData.images.map((file) => file.name);
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images: imagesURLs }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Property saved successfully!");
        setFormData({
          title: "",
          description: "",
          address: "",
          city: "",
          country: "",
          zipcode: "",
          latitude: "",
          longitude: "",
          contact: "",
          type: "Residential",
          listingStatus: "For Sale",
          homeType: "",
          size: "",
          plotArea: "",
          baths: "",
          beds: "",
          price: "",
          images: [],
        });
        setAiSuggestedPrice(null);
      } else {
        alert("Error saving property");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
    <div className="mx-auto mt-8 max-w-6xl px-4">
      <Card className="shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
          <CardTitle className="text-4xl font-extrabold text-white text-center">
            🏡 Sell Your Property
          </CardTitle>
          <p className="text-center text-indigo-100 mt-2">
            Fill out the details below to list your property
          </p>
        </CardHeader>

        <CardContent className="space-y-12 px-10 py-12">
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Info className="w-5 h-5 text-indigo-600" /> Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Title</Label>
                <Input name="title" value={formData.title} onChange={handleChange} placeholder="Beautiful Villa in Goa" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Write a few details..." />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <MapPin className="w-5 h-5 text-indigo-600" /> Location
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
              <Input name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Zipcode" />
            </div>
          </section>

          {/* Property Details */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Home className="w-5 h-5 text-indigo-600" /> Property Details
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <select name="type" className="rounded-md border border-gray-300 p-3 shadow-sm" value={formData.type} onChange={handleChange}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>
              <select name="listingStatus" className="rounded-md border border-gray-300 p-3 shadow-sm" value={formData.listingStatus} onChange={handleChange}>
                <option>For Sale</option>
                <option>For Rent</option>
                <option>Sold</option>
              </select>
              <Input name="homeType" value={formData.homeType} onChange={handleChange} placeholder="Home Type (e.g. Apartment)" />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Input name="size" value={formData.size} onChange={handleChange} placeholder="Size (sq ft)" />
              <Input name="beds" value={formData.beds} onChange={handleChange} placeholder="Beds" />
              <Input name="baths" value={formData.baths} onChange={handleChange} placeholder="Baths" />
            </div>
          </section>

          {/* Pricing */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <DollarSign className="w-5 h-5 text-indigo-600" /> Pricing
            </h3>
            <div className="flex items-center gap-4">
              <Input name="price" value={formData.price} onChange={handleChange} placeholder="Asking Price ($)" />
              <Button onClick={getAiPriceSuggestion} disabled={loadingAI} variant="secondary" className="whitespace-nowrap">
                {loadingAI ? "Calculating..." : "AI Suggest Price"}
              </Button>
            </div>
            {aiSuggestedPrice && (
              <div className="mt-3 rounded-lg bg-indigo-600 text-white px-5 py-3 shadow-lg text-center">
                Suggested by AI: <strong>${aiSuggestedPrice}</strong>
              </div>
            )}
          </section>

          {/* Images */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Image className="w-5 h-5 text-indigo-600" /> Upload Images
            </h3>
            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {formData.images.map((file, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border shadow-md">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="h-40 w-full object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 text-xs rounded-full px-2 py-1 text-white opacity-90 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Property"}
          </Button>
        </CardContent>
      </Card>
    </div>
<<<<<<< HEAD
    </DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
  );
}
