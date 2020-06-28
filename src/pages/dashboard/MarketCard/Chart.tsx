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
import ColorHash from 'color-hash-ts';

export default function Graph({ data, options }: any) {
  const colorHash = new ColorHash();
  function stringToHex(str: string): string {
    return colorHash.hex(str);
  }

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
          <XAxis dataKey="time" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />

          {options.map((option: any) => (
            <Line
              key={option}
              type="monotone"
              dataKey={option}
              stroke={stringToHex(option)}
              dot={false}
            />
          ))}
        </LineChart>
      </Flex>
    </Box>
  );
}
