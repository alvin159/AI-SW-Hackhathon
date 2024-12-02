"use client";

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Slider } from "@mui/material"; // Using Material-UI Slider for the year selection
import { Checkbox, FormControlLabel } from "@mui/material"; // Using Material-UI Checkbox for toggling lines

interface ChartProps {
  title: string;
  description: string;
  data: any[];
  config: {
    [key: string]: { label: string; color: string };
  };
}

export function Chart({ title, description, data, config }: ChartProps) {
  const [yearRange, setYearRange] = useState<[number, number]>([
    Math.min(...data.map(item => item.year)), // Set the initial start year as the minimum year in data
    Math.max(...data.map(item => item.year)) // Set the initial end year as the maximum year in data
  ]);
  const [visibleLines, setVisibleLines] = useState<string[]>(Object.keys(config)); // Default all lines visible

  // Filter the data based on selected year range
  const filteredData = data.filter(item => item.year >= yearRange[0] && item.year <= yearRange[1]);

  // Handle the visibility of each line based on checkbox toggles
  const handleCheckboxChange = (lineKey: string) => {
    setVisibleLines((prev) => {
      if (prev.includes(lineKey)) {
        return prev.filter((key) => key !== lineKey); // Remove line
      } else {
        return [...prev, lineKey]; // Add line
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} /*className="h-[300px]"*/>
          {/* Year Range Slider */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="year-slider">Select Year Range: {yearRange[0]} - {yearRange[1]}</label>
            <Slider
              id="year-slider"
              value={yearRange}
              min={Math.min(...data.map(item => item.year))}
              max={Math.max(...data.map(item => item.year))}
              step={1}
              marks
              onChange={(_, newValue) => setYearRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => value}
              disableSwap
            />
          </div>

          {/* Line Visibility Filters */}
          <div style={{ marginBottom: "16px" }}>
            {Object.keys(config).map((lineKey) => (
              <FormControlLabel
                key={lineKey}
                control={
                  <Checkbox
                    checked={visibleLines.includes(lineKey)}
                    onChange={() => handleCheckboxChange(lineKey)}
                  />
                }
                label={config[lineKey].label}
              />
            ))}
          </div>

          {/* Chart */}
          <div style={{ height: '85%' }}> {/* This div wraps the chart to give it a fixed height */}
            <ResponsiveContainer>
              <LineChart data={filteredData}>
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(config).map((key) => (
                  visibleLines.includes(key) && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config[key].color}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
