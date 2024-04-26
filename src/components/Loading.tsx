import { SyncLoader } from "react-spinners";

export const Loading = () => {
  return (
    <div className="table__loading">
      <SyncLoader color="#57b947" />
    </div>
  );
};

export default { Loading };
