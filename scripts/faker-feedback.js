import { faker } from "@faker-js/faker";

import "dotenv/config";
import { supabase } from "../src/api/supabaseClient.js";

async function seedFakeFeedback() {
  const total = 100; // number of rows to insert
  const rows = [];

  for (let i = 0; i < total; i++) {
    rows.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      message: faker.lorem.sentences(2),
      sentiment: faker.helpers.arrayElement([
        "Positive",
        "Negative",
        "Neutral",
      ]),
      topic_id: faker.number.int({ min: 1, max: 3 }),
      created_at: faker.date.recent({ days: 30 }).toISOString(),
    });
  }

  console.log(`⏳ Inserting ${total} fake feedback rows...`);

  const { error } = await supabase.from("feedback").insert(rows);

  if (error) {
    console.error("❌ Error inserting fake data:", error);
    return;
  }

  console.log(`✅ Inserted ${total} fake feedback rows successfully!`);
}

seedFakeFeedback();
