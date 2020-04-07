import DashboardLayout from "./dashboard";

export default frontMatter => {
  return ({ children }) => (
    <DashboardLayout {...frontMatter}>{children}</DashboardLayout>
  );
};
