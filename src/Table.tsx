import React, { useMemo } from 'react';
import { Table, Text, Loader } from '@mantine/core';
import useApiFetch from './useApiFetch';
import './Table1.css';

const TableData = () => {
  const { data, loading, error } = useApiFetch('./src/api/api.json');

  const processedData = useMemo(() => {
    if (!data) return [];

    // this is to find uniqueyears
    const uniqueYears = [...new Set(data.map(item => item.Year))];

    // Calculating maximum and minimum crop production for each year
    const yearStats = uniqueYears.map(year => {
      const cropsOfYear = data.filter(item => item.Year === year);
      const cropProductions = cropsOfYear.map(item => parseFloat(item["Crop Production (UOM:t(Tonnes))"]) || 0);
      const maxCropProduction = Math.max(...cropProductions);
      const minCropProduction = Math.min(...cropProductions.filter(value => value > 0));
      return {
        year,
        maxCropProduction: maxCropProduction === 0 ? 'N/A' : maxCropProduction,
        minCropProduction: minCropProduction === Infinity ? 'N/A' : minCropProduction
      };
    });

    return yearStats;
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <Text color="red">Error: {error}</Text>;

  return (
    <div className="data-table-wrapper">
      <Table className="data-table" striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Year</th>
            <th>Maximum Crop Production (Tonnes)</th>
            <th>Minimum Crop Production (Tonnes)</th>
          </tr>
        </thead>
        <tbody>
          {processedData.length === 0 ? (
            <tr>
              <td colSpan="3" className="no-data">No data available</td>
            </tr>
          ) : (
            processedData.map((item, index) => (
              <tr key={index}>
                <td>{item.year}</td>
                <td>{item.maxCropProduction}</td>
                <td>{item.minCropProduction}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableData;
