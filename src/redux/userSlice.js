import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signup = createAsyncThunk("/register", async (payload) => {
  const { firstName, lastName, email, password, role } = payload;
  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
      {
        firstName,
        lastName,
        email,
        password,
        role,
      }
    );
    return (await res).data;
  } catch (e) {
    if (e.response) {
      return { ...e.response.data, error: true };
    }
    return { error: true, message: "Server is not running correctly" };
  }
});

export const signin = createAsyncThunk("/api/auth/login", async (payload) => {
  const { email, password } = payload;
  try {
    const res = axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
      {
        email,
        password,
      }
    );
    return (await res).data;
  } catch (e) {
    if (e.response) {
      return { ...e.response.data, error: true };
    }
    return { error: true, message: "Server is not running correctly." };
  }
});

export const getUser = createAsyncThunk("/tokenlogin", async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/auth/tokenlogin`
  );
  return res.data;
});

export const getAllUsers = createAsyncThunk(
  "/api/auth/getAllUser",
  async (payload) => {
    const { perpage, page } = payload;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/getAllUser`,
        {
          perpage,
          page,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const allowUser = createAsyncThunk(
  "/api/auth/allowUser",
  async (payload) => {
    const { permission, userID } = payload;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/allowUser`,
        {
          permission,
          userID,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "/api/auth/updateUserProfile",
  async (payload) => {
    const { firstName, lastName, email, money, birthday, phone, bio, files } =
      payload;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/updateUserProfile`,
        {
          firstName,
          lastName,
          email,
          birthday,
          phone,
          money,
          bio,
          files,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const deleteUser = createAsyncThunk(
  "/api/auth/deleteUser",
  async (payload) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/deleteUser`,
        {
          payload,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const changeUserStore = createAsyncThunk(
  "/api/auth/changeUserStore",
  async (payload) => {
    const { storeID, id } = payload;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/changeUserStore`,
        {
          storeID,
          id,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "/api/auth/changeUserRole",
  async (payload) => {
    const { userRole, id } = payload;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/changeUserRole`,
        {
          userRole,
          id,
        }
      );
      return res.data;
    } catch (e) {
      if (e.response) {
        return { ...e.response.data, error: true };
      }
      return { error: true, message: "Server is not runnint correctly" };
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    user: null,
    users: null,
    error: "",
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    resetError: (state) => {
      state.error = "";
    },
    logOut: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      state.user = [];
    },
    setUserCoin: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: {
    [signin.pending]: (state) => {
      state.isLoading = true;
    },
    [signin.fulfilled]: (state, { payload }) => {
      if (payload.token) {
        axios.defaults.headers.common["Authorization"] = payload.token;
        localStorage.setItem("token", payload.token);
        state.user = payload.user;
        state.token = payload.token;
        state.isLoading = false;
      } else {
        state.isLoading = false;
      }
    },
    [signin.rejected]: (state, { payload }) => {
      state.error = payload.message;
      state.isLoading = false;
    },
    [getUser.pending]: (state) => {
      state.isLoading = true;
    },
    [getUser.fulfilled]: (state, { payload }) => {
      if (payload.token) {
        axios.defaults.headers.common["Authorization"] = payload.token;
        localStorage.setItem("token", payload.token);
        state.user = payload.user;
        state.token = payload.token;
        state.isLoading = false;
      } else {
        state.isLoading = false;
      }
    },
    [getUser.rejected]: (state, { payload }) => {
      state.error = payload?.message;
      state.isLoading = false;
    },
    [getAllUsers.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllUsers.fulfilled]: (state, { payload }) => {
      // if (payload.token) {
      // axios.defaults.headers.common["Authorization"] = payload.token;
      // localStorage.setItem("token", payload.token);
      state.users = payload.users;
      // state.token = payload.token;
      state.isLoading = false;
      // } else {
      //   state.isLoading = false;
      // }
    },
    [getAllUsers.rejected]: (state, { payload }) => {
      state.error = payload.message;
      state.isLoading = false;
    },
    // [updateUserProfile.pending]: (state) => {
    //   state.isLoading = true;
    // },
    // [updateUserProfile.fulfilled]: (state, { payload }) => {
    //     state.user = payload.user;
    //     state.isLoading = false;
    //   },

    // [updateUserProfile.rejected]: (state, { payload }) => {
    //   state.error = payload?.message;
    //   state.isLoading = false;
    // },
  },
});

export const { logOut, resetError, setUserCoin } = userSlice.actions;
export default userSlice.reducer;
