const prisma = require('../lib/prisma');

const assignments = [
  {
    title: 'Basic SELECT Query',
    description: 'Write a query to select all columns from the employees table.',
    difficulty: 'easy',
    category: 'SELECT',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'email', type: 'VARCHAR(100)', constraints: 'UNIQUE' },
          { name: 'department', type: 'VARCHAR(50)', constraints: '' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' },
          { name: 'hire_date', type: 'DATE', constraints: '' }
        ]
      }
    ],
    sampleData: {
      employees: [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@company.com', department: 'Engineering', salary: 75000, hire_date: '2020-01-15' },
        { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@company.com', department: 'Marketing', salary: 65000, hire_date: '2019-06-20' },
        { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob@company.com', department: 'Engineering', salary: 80000, hire_date: '2018-03-10' }
      ]
    },
    expectedResultDescription: 'All rows and columns from the employees table should be displayed.',
    hintContext: 'The SELECT * statement retrieves all columns. The FROM clause specifies the table.',
    order: 1
  },
  {
    title: 'WHERE Clause - Filter by Department',
    description: 'Write a query to find all employees who work in the Engineering department.',
    difficulty: 'easy',
    category: 'WHERE',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'department', type: 'VARCHAR(50)', constraints: '' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      employees: [
        { id: 1, first_name: 'John', last_name: 'Doe', department: 'Engineering', salary: 75000 },
        { id: 2, first_name: 'Jane', last_name: 'Smith', department: 'Marketing', salary: 65000 },
        { id: 3, first_name: 'Bob', last_name: 'Johnson', department: 'Engineering', salary: 80000 }
      ]
    },
    expectedResultDescription: 'Only employees from the Engineering department should appear in the results.',
    hintContext: 'Use the WHERE clause to filter rows. String values need to be in single quotes.',
    order: 2
  },
  {
    title: 'GROUP BY with COUNT',
    description: 'Write a query to count the number of employees in each department.',
    difficulty: 'medium',
    category: 'GROUP BY',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'department', type: 'VARCHAR(50)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      employees: [
        { id: 1, first_name: 'John', department: 'Engineering' },
        { id: 2, first_name: 'Jane', department: 'Marketing' },
        { id: 3, first_name: 'Bob', department: 'Engineering' },
        { id: 4, first_name: 'Alice', department: 'Engineering' }
      ]
    },
    expectedResultDescription: 'Each department should be listed once with the count of employees.',
    hintContext: 'GROUP BY groups rows with same values. Use COUNT(*) to count rows per group.',
    order: 3
  },
  {
    title: 'INNER JOIN - Combine Tables',
    description: 'Write a query to get all orders along with the customer name. Join the orders and customers tables.',
    difficulty: 'medium',
    category: 'JOIN',
    tables: [
      {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
          { name: 'email', type: 'VARCHAR(100)', constraints: '' }
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'customer_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
          { name: 'product', type: 'VARCHAR(100)', constraints: '' },
          { name: 'amount', type: 'DECIMAL(10,2)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      customers: [
        { id: 1, name: 'Alice Brown', email: 'alice@email.com' },
        { id: 2, name: 'Charlie Davis', email: 'charlie@email.com' }
      ],
      orders: [
        { id: 1, customer_id: 1, product: 'Laptop', amount: 1200.00 },
        { id: 2, customer_id: 1, product: 'Mouse', amount: 25.00 },
        { id: 3, customer_id: 2, product: 'Keyboard', amount: 75.00 }
      ]
    },
    expectedResultDescription: 'Each order should be shown with the corresponding customer name.',
    hintContext: 'JOIN connects tables using a common column. ON clause specifies matching columns.',
    order: 4
  },
  {
    title: 'Subquery in WHERE',
    description: 'Write a query to find all employees who earn more than the average salary.',
    difficulty: 'hard',
    category: 'SUBQUERY',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      employees: [
        { id: 1, first_name: 'John', last_name: 'Doe', salary: 75000 },
        { id: 2, first_name: 'Jane', last_name: 'Smith', salary: 65000 },
        { id: 3, first_name: 'Bob', last_name: 'Johnson', salary: 80000 },
        { id: 4, first_name: 'Alice', last_name: 'Williams', salary: 60000 }
      ]
    },
    expectedResultDescription: 'Only employees earning above the company average should be shown.',
    hintContext: 'A subquery is a query inside another query. Use (SELECT AVG(salary) FROM employees) in WHERE clause.',
    order: 5
  },
  {
    title: 'LEFT JOIN - All Customers',
    description: 'Write a query to list all customers and their orders, including customers who have not placed any orders.',
    difficulty: 'medium',
    category: 'JOIN',
    tables: [
      {
        name: 'customers',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL' }
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'customer_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
          { name: 'product', type: 'VARCHAR(100)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      customers: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ],
      orders: [
        { id: 1, customer_id: 1, product: 'Laptop' }
      ]
    },
    expectedResultDescription: 'All customers should be listed. Bob should have NULL for order details.',
    hintContext: 'LEFT JOIN returns all rows from the left table (customers), even if there are no matches in the right table (orders).',
    order: 6
  },
  {
    title: 'HAVING Clause - Department Size',
    description: 'Write a query to find departments that have more than 1 employee.',
    difficulty: 'medium',
    category: 'GROUP BY',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'department', type: 'VARCHAR(50)', constraints: '' }
        ]
      }
    ],
    sampleData: {
      employees: [
        { id: 1, first_name: 'John', department: 'Engineering' },
        { id: 2, first_name: 'Jane', department: 'Marketing' },
        { id: 3, first_name: 'Bob', department: 'Engineering' }
      ]
    },
    expectedResultDescription: 'Only Engineering should be listed because it has 2 employees.',
    hintContext: 'Use GROUP BY department and HAVING COUNT(*) > 1. WHERE filters rows, HAVING filters groups.',
    order: 7
  }
];

const employees = [
  { firstName: 'John', lastName: 'Doe', email: 'john@company.com', department: 'Engineering', salary: 75000, hireDate: new Date('2020-01-15') },
  { firstName: 'Jane', lastName: 'Smith', email: 'jane@company.com', department: 'Marketing', salary: 65000, hireDate: new Date('2019-06-20') },
  { firstName: 'Bob', lastName: 'Johnson', email: 'bob@company.com', department: 'Engineering', salary: 80000, hireDate: new Date('2018-03-10') },
  { firstName: 'Alice', lastName: 'Williams', email: 'alice@company.com', department: 'Engineering', salary: 60000, hireDate: new Date('2021-09-01') },
  { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@company.com', department: 'Sales', salary: 70000, hireDate: new Date('2020-05-15') }
];

const customers = [
  { name: 'Alice Brown', email: 'alice@email.com' },
  { name: 'Charlie Davis', email: 'charlie@email.com' },
  { name: 'Eve Wilson', email: 'eve@email.com' }
];

const orders = [
  { customerId: 1, product: 'Laptop', amount: 1200.00 },
  { customerId: 1, product: 'Mouse', amount: 25.00 },
  { customerId: 2, product: 'Keyboard', amount: 75.00 },
  { customerId: 3, product: 'Monitor', amount: 350.00 },
  { customerId: 2, product: 'USB Hub', amount: 45.00 }
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.queryAttempt.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.user.deleteMany();

    // Seed assignments
    console.log('Seeding assignments...');
    for (const assignment of assignments) {
      await prisma.assignment.create({ data: assignment });
    }
    console.log(`  ✅ Created ${assignments.length} assignments`);

    // Seed employees
    console.log('Seeding employees...');
    for (const employee of employees) {
      await prisma.employee.create({ data: employee });
    }
    console.log(`  ✅ Created ${employees.length} employees`);

    // Seed customers
    console.log('Seeding customers...');
    const createdCustomers = [];
    for (const customer of customers) {
      const created = await prisma.customer.create({ data: customer });
      createdCustomers.push(created);
    }
    console.log(`  ✅ Created ${customers.length} customers`);

    // Seed orders
    console.log('Seeding orders...');
    for (const order of orders) {
      // Map 1-based ID from seed data to actual DB ID
      const customerIndex = order.customerId - 1;
      if (createdCustomers[customerIndex]) {
        const newOrder = { ...order, customerId: createdCustomers[customerIndex].id };
        await prisma.order.create({ data: newOrder });
      }
    }
    console.log(`  ✅ Created ${orders.length} orders`);

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
