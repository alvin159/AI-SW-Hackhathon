# Agriculture Market Analysis Dashboard

A modern dashboard for analyzing agricultural market trends in Finland, built with Next.js, Tailwind CSS, and ShadcnUI.

## Features

- 📊 Visualization of crop yields, production forecasts and fertilizer sales data
- 📱 Responsive design with mobile support
- 🌓 Dark mode
- 📈 Interactive trend analysis and price tracking
- 🎨 Clean, modern interface

## Local Setup

1. Clone the repository:
```bash
git clone https://github.com/alvin159/AI-SW-Hackhathon.git
cd AI-SW-Hackhathon
```

2. Install dependencies with legacy peer deps:
```bash
npm install
```

3. Configure environment variables:  
- There is a `.env.example` file provided in the repository, which includes the required variables for OpenWeather and OpenAI APIs.  
- Copy the example file to `.env.local` and fill in your API keys:
    ```bash
    cp .env.example .env.local
    ```
    Update `.env.local` with your API keys:
    ```env
    NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```



4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

## Troubleshooting Common Issues

If you encounter any installation errors:

1. Clear your node_modules and cache:
```bash
rm -rf node_modules
rm -rf .next
rm package-lock.json
```

2. Reinstall dependencies:
```bash
npm install --legacy-peer-deps
```


