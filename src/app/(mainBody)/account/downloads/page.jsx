import AccountDownloads from "@/components/pages/account/downloads";
import React, { Suspense } from "react";
import Loader from "@/layout/loader";

const AccountDownload = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AccountDownloads />
    </Suspense>
  );
};

export default AccountDownload;
