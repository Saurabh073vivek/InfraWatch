const ML_SERVICE_URL = "http://127.0.0.1:8000";

async function predictRisk(data) {
  const response = await fetch(
    `${ML_SERVICE_URL}/predict-risk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `ML Service Error: ${errorText}`
    );
  }

  return await response.json();
}

module.exports = {
  predictRisk,
};