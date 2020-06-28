import React from 'react';
import { Box, Flex } from '@chakra-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function Graph({ data, options, optionsWithColor }: any) {
  console.log('data:', data);
  console.log('optionsWithColor:', optionsWithColor);
  console.log('options:', options);

  return (
    <Box mt="3rem">
      <Flex justify="center">
        <LineChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />

          {options.map((option: any) => (
            <Line
              key={option}
              type="monotone"
              dataKey={option}
              // stroke={randomColor()}
              stroke={'#000000'}
              dot={false}
            />
          ))}
        </LineChart>
      </Flex>
    </Box>
  );
}
