/**
 * =================================================
 * #Author: Gale Salazar
 * GitHub: @GaleSSalazar
 * #Contributors:
 *
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Contains the Features component for showcasing product capabilities.
 * =================================================
 **/

// import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import AuthButtons from "../common/AuthButtons";
// import UserProfile from "../common/UserProfile";

const GetStarted: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
      <AuthButtons showAvatar={false} />
    </div>
  );
};
export default GetStarted;
