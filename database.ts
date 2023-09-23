import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (username: string) => {
  try {
    // Create a new user with an initial balance of 0
    const newUser = await prisma.user.create({
      data: {
        username: username,
        balance: 0,
      },
    });

    console.log('User created:', newUser);
  } catch (error) {
    console.error(error);
  }
};

export const checkUser = async (username: string) => {
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    return !!user; // Return true if the user exists, false otherwise
  } catch (error) {
    console.error(error);
    return false; 
  }
};

export const addIncome = async (username: string, income: number, description: string) => {
  try {
    // Add income transaction
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    const incomeTransaction = await prisma.transaction.create({
      data: {
        timestamp: new Date(),
        amount: income,
        type: 'income',
        description: description,
        userId: user.id, // Associate with the user
      },
    });

    // Update the user's balance
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: {
          increment: income,
        },
      },
    });

    console.log('Income added:', incomeTransaction);
    console.log('Updated user balance:', updatedUser.balance);
  } catch (error) {
    console.error(error);
  }
};

export const addExpense = async (username: string, expense: number, description: string) => {
  try {
    // Add expense transaction
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    const expenseTransaction = await prisma.transaction.create({
      data: {
        timestamp: new Date(),
        amount: expense,
        type: 'expense',
        description: description,
        userId: user.id, // Associate with the user
      },
    });

    // Update the user's balance
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        balance: {
          decrement: expense,
        },
      },
    });

    console.log('Expense added:', expenseTransaction);
    console.log('Updated user balance:', updatedUser.balance);
  } catch (error) {
    console.error(error);
  }
};

export const showTransaction = async (username: string) => {
  try {
    // Retrieve user's transactions
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        transactions: true,
      },
    });

    if (!user) {
      console.error('User not found');
      return [];
    }

    return user.transactions;
  } catch (error) {
    console.error(error);
   return [];
  }
};

export const showBalance = async (username: string) => {
  try {
    // Retrieve user's balance
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.error('User not found');
      return null;
    }

    return user.balance;
  } catch (error) {
    console.error(error);
    return null;
  }
};


async function deleteTransactionById(transactionId: number) {
  try {
    // Find the transaction to be deleted
    const transactionToDelete = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transactionToDelete) {
      console.error('Transaction not found');
      return;
    }

    // Determine the type (income or expense) of the transaction
    const transactionType = transactionToDelete.type;

    // Calculate the adjustment to the user's balance
    const adjustment = transactionType === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;

    // Delete the transaction
    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    // Update the user's balance
    await prisma.user.update({
      where: {
        id: transactionToDelete.userId,
      },
      data: {
        balance: {
          increment: adjustment, // Increment or decrement based on transaction type
        },
      },
    });

    console.log('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
  } finally {
    await prisma.$disconnect();
  }
}


async function deleteUser(username: string) {
  try {
    // Find the user and their ID
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.error('User not found');
      return;
    }

    // Find and delete all transactions associated with the user
    await prisma.transaction.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Delete the user
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    console.log('User and related transactions deleted successfully');
  } catch (error) {
    console.error('Error deleting user and transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function listUsers() {
  try {
    // Retrieve all users
    const users = await prisma.user.findMany();

    // Output the list of users
    console.log('List of Users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Balance: ${user.balance}`);
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}


// async function main() {
//   await createUser('alice');
//   await createUser('bob');
//   await createUser('charlie');
//   await listUsers();
// }

// main().catch((e) => {
//   console.log('from main func')
//   console.log(e);
// }).finally(async () => {
//   await prisma.$disconnect();
// });