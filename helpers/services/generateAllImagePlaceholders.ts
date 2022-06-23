// ONLY RUN THIS FUNCTION IN A SERVER ENVIRONMENT

import { getSupaMasterClient } from "./SupabaseClient";

export async function generateAllImagePlaceholders() {
  const client = getSupaMasterClient();
  if (!client) throw new Error("Can ony generate image placeholders in a server environment");

  const { } = await client.from('')
}