import { createAsyncThunk, createSlice } from "@reduxjs/toolkit/react";

export const userLogin = createAsyncThunk(
  "userLogin",

  async ({ login, password }: { login: string; password: string }) => {
    try {
      const response = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/account/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ login, password }),
        }
      );

      const data = await response.json();
      if (data && !data.errorCode) {
        localStorage.setItem("token", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const userInformation = createAsyncThunk(
  "userInformation",

  async ({ token }: { token: string }) => {
    try {
      const response = await fetch(
        "https://gateway.scan-interfax.ru/api/v1/account/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка получения данных");

      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
);

const authorizationSlice = createSlice({
  name: "authorization",
  initialState: {
    entrance: "enter",
    loadingUser: false,
    loadingUserInformation: false,
    user: {
      token: {
        accessToken: "",
        expire: "",
      },
      eventFiltersInfo: {
        companyLimit: "",
        usedCompanyCount: "",
      },
    },
  },
  reducers: {
    upActive: (state, action) => {
      state.entrance = action.payload;
    },
    setUser: (state, action) => {
      state.user.token = action.payload;
    },
    logoutUser: (state, action) => {
      state.user.token.accessToken = action.payload;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.user.token = action.payload;
      })
      .addCase(userInformation.pending, (state) => {
        state.loadingUserInformation = true;
      })
      .addCase(userInformation.fulfilled, (state, action) => {
        state.user.eventFiltersInfo = action.payload.eventFiltersInfo;
        state.loadingUserInformation = false;
      })
      .addCase(userInformation.rejected, (state) => {
        state.loadingUserInformation = false;
      });
  },
});

// Экспортируем действия
export const { upActive, setUser, logoutUser } = authorizationSlice.actions;

// Экспортируем редьюсер
export default authorizationSlice.reducer;
