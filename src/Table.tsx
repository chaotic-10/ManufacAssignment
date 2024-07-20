import React, { useMemo } from 'react';
import { Table } from '@mantine/core';
import useApiFetch from './useApiFetch';

const TableData = () => {
  const { data, loading, error } = useApiFetch('./src/api/api.json');

  const processedData = useMemo(() => {
    if (!data) return [];

    // Extracting unique years
    const uniqueYears = [...new Set(data.map(item => item.Year))];

    // Compute maximum and minimum crop production for each year
    const yearStats = uniqueYears.map(year => {
      const cropsOfYear = data.filter(item => item.Year === year);
      const cropProductions = cropsOfYear.map(item => parseFloat(item["Crop Production (UOM:t(Tonnes))"]) || 0);
      const maxCropProduction = Math.max(...cropProductions);
      const minCropProduction = Math.min(...cropProductions.filter(value => value > 0)); // Filter out 0s to get the minimum actual production value

      return {
        year,
        maxCropProduction: maxCropProduction === 0 ? 'N/A' : maxCropProduction,
        minCropProduction: minCropProduction === Infinity ? 'N/A' : minCropProduction
      };
    });

    return yearStats;
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>Maximum Crop Production (Tonnes)</Table.Th>
          <Table.Th>Minimum Crop Production (Tonnes)</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <tbody>
        {processedData.map((item, index) => (
          <Table.Tr key={index}>
            <Table.Td>{item.year}</Table.Td>
            <Table.Td>{item.maxCropProduction}</Table.Td>
            <Table.Td>{item.minCropProduction}</Table.Td>
          </Table.Tr>
        ))}
      </tbody>
    </Table >
  );
};

export default TableData;
