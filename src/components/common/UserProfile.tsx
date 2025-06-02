/**
 * =================================================
 * #Author: Gale Salazar
 * GitHub: @GaleSSalazar
 * #Contributors:
 *
 *
 *
 * License: Apache License 2.0 (see LICENSE file for details)
 * Copyright (c) 2025-Present Archetype Dynamics, Inc.
 * #File Description:
 *    Main application component that assembles the page layout.
 * =================================================
 **/

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const UserProfile = () => {
  const { user, isAuthenticated } = useKindeAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div>
      <img
        src={user.picture}
        alt="User profile"
        className="h-8 w-8 rounded-full object-cover"
      />
    </div>
  );
};

export default UserProfile;
