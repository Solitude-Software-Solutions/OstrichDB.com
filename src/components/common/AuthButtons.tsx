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

import React, { useState, useEffect } from "react";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-react/components";
// import { LogoutLink } from "@kinde-oss/kinde-auth-react/components";

const AuthButtons = () => {
  return (
    <>
      {/* AUTH kinde hosted login component */}
      <LoginLink className="btn btn-outline text-sm" type="button">
        Sign In
      </LoginLink>
      {/* AUTH kinde hosted register component */}
      <RegisterLink className="btn btn-primary text-sm" type="button">
        Start Free
      </RegisterLink>
      {/* <LogoutLink>Logout</LogoutLink> */}
    </>
  );
};

export default AuthButtons;
