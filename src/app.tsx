import { Button, Rows, Text, FormField, TextInput, Link } from "@canva/app-ui-kit";
import { addNativeElement } from "@canva/design";
import React, { useState } from "react";
import styles from "styles/components.css";

export const App = () => {
  const [prompt, setPrompt] = useState('');
  const [itemURL, setItemURL] = useState('');
  const [error, setError] = useState('');

  const fetchItemURL = async (prompt) => {
    try {
      const response = await fetch('https://bbspacecave.com/api/1.1/wf/apinquiry/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data); // Log the full response
      if (!data.response || !data.response.ItemURL) {
        throw new Error("ItemURL not found in response");
      }
      return data.response.ItemURL;
    } catch (error) {
      console.error("Failed to fetch Item URL:", error.message);
      return null; // Ensure to handle null in your component where this function is used
    }
  };

  const onClick = async () => {
    try {
      setError(''); // Clear any previous errors
      const fetchedItemURL = await fetchItemURL(prompt);
      console.log("Fetched ItemURL:", fetchedItemURL); // Log the fetched URL
      if (!fetchedItemURL) {
        throw new Error('Failed to fetch Item URL after multiple attempts');
      }
      setItemURL(fetchedItemURL);

      addNativeElement({
        type: "TEXT",
        children: [fetchedItemURL],
      });
    } catch (error) {
      console.error('Error fetching Item URL:', error);
      setError(error.message);
      setItemURL('');
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>Create a custom product by entering a prompt below</Text>
        <FormField
          label=""
          control={() => (
            <TextInput
              defaultValue={prompt}
              onBlur={(e) => setPrompt(e.target.value)}
              placeholder="Enter prompt"
            />
          )}
        />
        <Button variant="primary" onClick={onClick} stretch>
          Generate Product
        </Button>
        {error && (
          <Text size="medium" color="danger">
            {error}
          </Text>
        )}
        {itemURL && (
          <Text size="medium">
            <Link
              href={itemURL}
              requestOpenExternalUrl={() => {}}
              ariaLabel="Open generated item"
              target="_blank"
            >
              Open Item URL
            </Link>
          </Text>
        )}
      </Rows>
    </div>
  );
};
