"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDownToLine, ImageIcon, Loader2 } from "lucide-react"

export default function TextToImageConverter() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  async function query(data:{inputs:string}) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob(); // Get the blob response (likely an image)
    return result;
  }
  const handleConvert = async () => {
    setIsLoading(true)
    // Simulating API call for text-to-image conversion
    query({ inputs: prompt }).then((response) => {
      // Create an object URL from the blob and set it as the image source
      const imageUrl = URL.createObjectURL(response);
      setImageUrl(imageUrl)
      setIsLoading(false)
      });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Text to Image Converter</h1>
        <Textarea
          placeholder="Enter your text here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 bg-gray-800 border-gray-700 rounded-lg resize-none"
        />
        <Button
          onClick={handleConvert}
          disabled={!prompt || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="mr-2 h-4 w-4" />
          )}
          Convert to Image
        </Button>
        {imageUrl && (
          <div className="space-y-4">
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
              <img src={imageUrl} alt="Generated image" className="w-full h-auto" />
            </div>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                <a href={imageUrl} 
              download="generated-image.jpg">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Download Image

              </a>
              
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}