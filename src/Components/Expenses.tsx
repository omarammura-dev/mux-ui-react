import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  parseISO,
  startOfMonth,
  isValid,
  eachMonthOfInterval,
  endOfYear,
  startOfYear,
} from "date-fns";
import { get } from "../Service/request";

interface Expense {
  _id: string;
  expenseDate: string;
  expenseName: string;
  expenseType: string;
  price: number;
  userId: string;
}

const ExpenseStatistics: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "MMM yyyy")
  );

  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery<Expense[], Error>(["expenses"], () => get("/expense/all"), {
    onError: (error) => {
      console.error("Error fetching expenses:", error);
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading expenses: {error.message}
      </Typography>
    );
  }

  const chartData = expenses?.reduce((acc, expense) => {
    if (expense.expenseDate) {
      const parsedDate = parseISO(expense.expenseDate);
      if (!isValid(parsedDate)) {
        console.error(`Invalid date: ${expense.expenseDate}`);
        return acc;
      }
      const date = startOfMonth(parsedDate);
      const monthYear = format(date, "MMM yyyy");
      if (monthYear === selectedMonth) {
        const existingEntry = acc.find(
          (item) => item.expenseDate === monthYear
        );
        if (existingEntry) {
          existingEntry.TotalAmount += expense.price;
          const existingType = existingEntry.types.find(
            (type) => type.name === expense.expenseType
          );
          if (existingType) {
            existingType.amount += expense.price;
          } else {
            existingEntry.types.push({
              name: expense.expenseType,
              amount: expense.price,
            });
          }
        } else {
          acc.push({
            expenseDate: monthYear,
            TotalAmount: expense.price,
            types: [{ name: expense.expenseType, amount: expense.price }],
          });
        }
      }
    }
    return acc;
  }, [] as { expenseDate: string; TotalAmount: number; types: { name: string; amount: number }[] }[]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
  };

  const handleAddExpense = () => {
    // TODO: Implement the logic to add a new expense
    console.log("Add expense button clicked");
  };

  const availableMonths = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  }).map((date) => format(date, "MMM yyyy"));

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Expense Statistics
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handleAddExpense}>
            Add Expense
          </Button>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Expenses by Month and Type</Typography>
                <FormControl variant="outlined" style={{ minWidth: 120 }}>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    label="Month"
                  >
                    {availableMonths.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="expenseDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chartData &&
                    chartData[0]?.types.map((type) => (
                      <Bar
                        key={type.name}
                        dataKey={(data: any) =>
                          data.types.find(
                            (t: { name: string; amount: number }) =>
                              t.name === type.name
                          )?.amount || 0
                        }
                        name={type.name}
                        stackId="a"
                        fill={`#${Math.floor(Math.random() * 16777215).toString(
                          16
                        )}`}
                      />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Expense Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses
                      ?.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((expense) => (
                        <TableRow key={expense._id}>
                          <TableCell>
                            {expense.expenseName ? expense.expenseName : "-"}
                          </TableCell>
                          <TableCell>
                            {expense.expenseDate
                              ? format(
                                  new Date(expense.expenseDate),
                                  "dd/MM/yyyy"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {expense.expenseType ? expense.expenseType : "-"}
                          </TableCell>
                          <TableCell align="right">
                            {expense?.price ? `$${expense.price}` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={expenses?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ExpenseStatistics;
