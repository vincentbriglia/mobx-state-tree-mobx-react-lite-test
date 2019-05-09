import { Instance, onSnapshot, SnapshotIn, types } from 'mobx-state-tree';
import { createContext } from 'react';

// Users can be used anywhere in an app, therefore it's best not to attach
// anything specific to them and use them as a reference instead
const UserModel = types.model('User', {
  employeeId: types.identifier,
  name: types.string,
});
export type IUserModel = Instance<typeof UserModel>;
export type IUserModelSnapshotIn = SnapshotIn<typeof UserModel>;

const PictureModel = types.model('Picture', {
  pictureId: types.identifier,
  base64: types.optional(types.string, ''),
});
export type IPictureModel = Instance<typeof PictureModel>;
export type IPictureModelSnapshotIn = SnapshotIn<typeof PictureModel>;

// Expenses are only ever going to be part of Reports, so it makes sense to have
// them attached to reports
const ExpenseModel = types
  .model('Expense', {
    expenseId: types.identifier,
    users: types.array(types.reference(types.late(() => UserModel))),

    // It remains to be decided on whether we want to take pictures without creating an expense or a
    // report, therefore allowing people to revisit the pictures afterwards. For the sake of the
    // demonstration we will do it like that. otherwise don't use references, but just a map
    pictures: types.array(types.reference(types.late(() => PictureModel))),
  })
  .actions((self) => ({
    addUser(userId: string) {
      // TODO: Figure out how to use indexOf (mobx-state-tree types are limited)
      self.users.push(userId);
    },
  }));
export type IExpenseModel = Instance<typeof ExpenseModel>;
export type IExpenseModelSnapshotIn = SnapshotIn<typeof ExpenseModel>;

// Reports are the main driver of this system, they contain the expenses for a user
const ReportModel = types
  .model('Report', {
    reportId: types.identifier,
    name: types.string,
    user: types.maybe(types.reference(types.late(() => UserModel))),
    expenses: types.optional(types.map(ExpenseModel), {}),
  })
  .actions((self) => ({
    addExpense(expense: IExpenseModelSnapshotIn) {
      const model = ExpenseModel.create(expense);
      self.expenses.put(model);

      return model;
    },
  }));
export type IReportModel = Instance<typeof ReportModel>;
export type IReportModelSnapshotIn = SnapshotIn<typeof ReportModel>;

const RootModel = types
  .model('Root', {
    users: types.map(UserModel),
    reports: types.optional(types.map(ReportModel), {}),
    pictures: types.optional(types.map(PictureModel), {}),
  })
  .actions((self) => ({
    addUser(user: IUserModelSnapshotIn) {
      const model = UserModel.create(user);
      self.users.put(model);
      return model;
    },
    addReport(report: IReportModelSnapshotIn) {
      const model = ReportModel.create(report);
      self.reports.put(model);
      return model;
    },
    getReport(reportId: string) {
      return self.reports.get(reportId);
    },
  }));

export type IRootModel = Instance<typeof RootModel>;

export const rootModel = RootModel.create();

(window as any).rootModel = rootModel;

export const StoreContext = createContext(rootModel);

let currentFrame = 1;

onSnapshot(rootModel, (snapshot) => {
  console.log(currentFrame, snapshot);
  currentFrame++;
});

rootModel.addUser({
  employeeId: '1',
  name: 'User Name 1',
});

rootModel.addUser({
  employeeId: '2',
  name: 'User Name 2',
});

rootModel.addUser({
  employeeId: '3',
  name: 'User Name 3',
});

rootModel.addReport({
  reportId: '1',
  name: 'Amsterdam Trip',
  user: '1',
});

const report = rootModel.addReport({
  reportId: '2',
  name: 'Software License Renewal',
  user: '2',
});

if (report) {
  const expense = report.addExpense({
    expenseId: '1',
  });

  expense.addUser('1');
  expense.addUser('2');
  expense.addUser('3');

  setTimeout(() => {
    rootModel.addUser({ employeeId: '4', name: 'User Name 4' });
  }, 2000);

  setTimeout(() => {
    expense.addUser('4');
  }, 3000);
}
