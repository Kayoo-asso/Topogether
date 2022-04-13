require("dotenv").config({ path: './.env.development'});

const fs = require("fs");
const gradient = require("gradient-string");
const path = require("path");
const ProgressBar = require("progress");
const fetch = require("cross-fetch");

const {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} = require("graphql");

const supagradient = gradient(["#00CB8A", "#78E0B8"]);

function fetchGraphQLSchema(url, options) {
  options = options || {}; // eslint-disable-line no-param-reassign

  const bar = new ProgressBar("🔦  Introspecting schema [:bar]", 24);

  const id = setInterval(function () {
    bar.tick();
    if (bar.complete) {
      clearInterval(id);
    }
  }, 250);

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcXR5cm5rcmVodmtwZXJvdXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDkxNjk3NDksImV4cCI6MTk2NDc0NTc0OX0.fZEflfXUKQYCTqU4BMw10TGBbpWVRtNHd4SzpD0GsNA',
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs'
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
  })
    .then((res) => res.json())
    .then(x => console.log("Response:", x))
    .then((schemaJSON) => {
      if (options.readable) {
        return printSchema(buildClientSchema(schemaJSON.data));
      }

      bar.complete();
      return JSON.stringify(schemaJSON, null, 2);
    });
}

const filePath = path.join(__dirname, "./schema.graphql");

console.log();

console.log(
  supagradient(
    `🗞   Fetching GraphQL Schema from https://viqtyrnkrehvkperouqf.supabase.co/graphql/v1...`
  )
);

// fetchGraphQLSchema(`https://viqtyrnkrehvkperouqf.supabase.co/graphql/v1`, {
fetchGraphQLSchema(`http://localhost:54321/graphql/v1`, {
  readable: true,
}).then((schema) => {
  fs.writeFileSync(filePath, schema, "utf-8");
  console.log(supagradient(`✨  Saved to ${filePath}`));
  console.log(
    '💡  Be sure to run "yarn run codegen" to generate latest types.'
  );
});