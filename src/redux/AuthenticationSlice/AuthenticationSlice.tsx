import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IChangePassWord,
  AutoLoginApi,
  ClearTokenApi,
  ClearTokenRequest,
  LoginApi,
  LogoutApi,
  NewPasswordRequest,
  RegisterApi,
  ChangePasswordAPI,
  SendAuthOtp,
  SendOtpRequest,
  UpdatePasswordApi,
} from "../../services/AuthenticationApi/AuthenticationApi";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ILogin {
  //interface login
  email: string;
  password: string;
}
interface ILoginS {
  //interface login success
  accountId: number;
  listRoles: string[];
  accessToken: string;
  refreshToken: string;
  username: string;
  follower: number;
  following: number;
  upload: number;
  profilePicture: string;
}

interface IRegister {
  //interface register
  email: string;
  password: string;
  roleName: string;
}
interface InitialStateStylesLogin {
  //interface initial state login
  loading: boolean;
  isRefresh: boolean;
  Error: string;
  isLogined: boolean;
  isRegister: boolean;
  username: string;
  listRoles: string[];
  accountId: number | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  otp: string | null;
  otpExpires: string | null;
  profilePicture: string | null;
  follower: number;
  following: number;
  upload: number;
  ilogins:ILoginS |null;
}
const getStorageItem = (key: string) => {
  //hàm lấy item từ local storage
  const item = localStorage.getItem(key);
  return item || null;
};
const initialState: InitialStateStylesLogin = {
  //initial state login
  loading: false,
  isRefresh: false,
  Error: "",
  isLogined: false,
  isRegister: false,
  username: "",
  listRoles: [],
  isAuthenticated: !!localStorage.getItem("accessToken"),
  accessToken: getStorageItem("accessToken"),
  refreshToken: getStorageItem("refreshToken"),
  otp: null,
  otpExpires: null,
  accountId: 0,
  ilogins: null,
  profilePicture: null,
  follower: 0,
  following: 0,
  upload: 0
};

export const LoginAction = createAsyncThunk<ILoginS, ILogin>(
  "Authentication/LoginAction", //name login
  async (login: ILogin, { rejectWithValue }) => {
    try {
      const response = await LoginApi(login); //login api
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      return rejectWithValue(error.message); //rejectWithValue
    }
  }
);

export const RegisterAction = createAsyncThunk(
  "Authentication/RegisterAction", //name register
  async (register: IRegister) => {
    const values = {
      email: register.email,
      password: register.password,
      roleName: register.roleName,
    };

    try {
      const response = await RegisterApi(values); //register api
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      throw Error(error.message); //throw error
    }
  }
);
export const LogoutAction = createAsyncThunk(
  "Authentication/LogoutAction", //name logout
  async () => {
    try {
      const response = await LogoutApi(); //logout api
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.message); //toast error
      throw Error(error.message); //throw error
    }
  }
);
export const AutoLoginAction = createAsyncThunk<ILoginS>(
  "AutoLoginAction",
  async () => {
    try {
      const res = await AutoLoginApi();
      if (res) {
        return res as unknown as ILoginS;
      } else {
        throw new Error("Unauthorized");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      throw Error(error.message); //throw error
    }
  }
);
export const ChangePasswordAction = createAsyncThunk(
  "Authentication/ChangePasswordAction",
  async (value: IChangePassWord) => {
    try {
      const response = await ChangePasswordAPI(value);
      return response;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      throw Error(error.message);
    }
  }
);

export const SendAuthOtpAction = createAsyncThunk<string, SendOtpRequest>(
  "SendAuthOtpAction",
  async (values: SendOtpRequest) => {
    try {
      const response = await SendAuthOtp(values); //SendAuthOtp api
      console.log(response);

      return response as unknown as string;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      throw Error(error.message); //throw error
    }
  }
);

export const UpdatePasswordAction = createAsyncThunk<
  string,
  NewPasswordRequest
>("UpdatePasswordAction", async (data: NewPasswordRequest) => {
  try {
    const response = await UpdatePasswordApi(data); //UpdatePassword api
    return response as unknown as string;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    throw Error(error.message); //throw error
  }
});

export const ClearTokenAction = createAsyncThunk<string, ClearTokenRequest>(
  "ClearTokenAction",
  async (data: ClearTokenRequest) => {
    try {
      const response = await ClearTokenApi(data); //UpdatePassword api
      return response as unknown as string;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      throw Error(error.message); //throw error
    }
  }
);
const AuthenticationSlice = createSlice({
  name: "Authentication", //name slice
  initialState, //initial state
  reducers: {
    userRegister: (state) => {
      state.isRegister = true;
    },
    clearState: (state) => {
      state.isRegister = false;
    },
    clearStateWhenLogout: (state) => {
      state.isLogined = false;
    },
    loginStart: (state) => {
      state.loading = true; // Đặt loading = true khi bắt đầu đăng nhập
    },
    registerStart: (state) => {
      state.loading = true; // Đặt loading = true khi bắt đầu đăng ký
    },

    loginSuccess: (state, action) => {
      const { username, listRoles, accessToken, refreshToken } = action.payload;
      state.loading = false; // Đặt loading = false khi đăng nhập thành công
      state.isLogined = true; //đăng nhập thành công
      state.isAuthenticated = true; //đăng nhập thành công
      state.accessToken = accessToken; //accessToken
      state.refreshToken = refreshToken; //refreshToken
      state.username = username; //username
      state.listRoles = listRoles; //listRoles
    },
    updateToken: (state, action) => {
      const { accessToken } = action.payload; //payload accessToken
      state.accessToken = accessToken; //accessToken
    },
    registerSuccess: (state) => {
      state.loading = false; // Đặt loading = false khi đăng nhập thành công
      state.isRegister = true; //đăng ký thành công
    },
    loginFailure: (state) => {
      state.loading = false; //đăng nhập thất bại
    },
    registerFailure: (state) => {
      state.loading = false; //đăng ký thất bại
    },
    logout: (state) => {
      state.isAuthenticated = false; //đăng nhập thất bại
      state.isLogined = false; //đăng nhập thất bại
      state.username = ""; //username
      state.listRoles = []; //listRoles
      state.accessToken = null; //accessToken
      state.refreshToken = null; //refreshToken
    },
    updateOtpState: (state, action) => {
      state.otp = action.payload.otp;
      state.otpExpires = action.payload.otpExpires;
    },
    updateStateLoading: (state, action) => {
      state.loading = action.payload;
      state.isRefresh = action.payload;
    },
    updateStateUsername: (state, action) => {
      state.username = action.payload.username;
      if(action.payload.profilePicture){
        state.profilePicture = action.payload.profilePicture;
      }
    },
    updateFollowing: (state,action) => {
      state.following=action.payload;
    },
    updateFollower: (state,action) => {
      state.follower=action.payload;
    },
    updateUpload: (state,action) => {
      state.upload=action.payload;
    },
  },
  
  extraReducers(builder) {
    builder
      .addCase(LoginAction.pending, (state) => {
        state.loading = true;
        state.isLogined = false;
      })
      .addCase(RegisterAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(LogoutAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(AutoLoginAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangePasswordAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(SendAuthOtpAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdatePasswordAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(ClearTokenAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        LoginAction.fulfilled,
        (state, action: PayloadAction<ILoginS>) => {
          toast.success("login successful");
          state.loading = false;
          state.isLogined = true;
          state.username = action.payload.username;
          state.listRoles = action.payload.listRoles;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.accountId = action.payload.accountId;
          state.ilogins=action.payload;
          state.profilePicture=action.payload.profilePicture;
          state.follower= action.payload.follower;
          state.following= action.payload.following;
          state.upload= action.payload.upload;
        }
      )
      .addCase(RegisterAction.fulfilled, (state) => {
        state.loading = false;
        state.isRegister = true;
      })
      .addCase(LogoutAction.fulfilled, (state) => {
        state.loading = false;
        toast.success("Logout successful");
        setTimeout(() => {
          window.location.href = "/login";
          state.isLogined = false;
          state.username = "";
          state.listRoles = [];
          state.accessToken = null;
          state.refreshToken = null;
          state.accountId = null;
        });
      })
      .addCase(AutoLoginAction.fulfilled, (state, action:PayloadAction<ILoginS>) => {
        state.loading = false;
        if(window.location.pathname.startsWith("/admin")){
          if(action.payload.listRoles && action.payload.listRoles.length>0 && action.payload.listRoles[0]!=="ADMIN"){
            toast.error("Bạn không có quyền truy cập vào trang này");
            setTimeout(()=>{
              window.location.href = "/document";
            },2000);
          }else{
            state.isLogined = true;
            state.username = action.payload.username;
            state.listRoles = action.payload.listRoles;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.accountId = action.payload.accountId;
            state.ilogins=action.payload;
            state.profilePicture=action.payload.profilePicture;
            state.follower= action.payload.follower;
          state.following= action.payload.following;
          state.upload= action.payload.upload;
          }
        }else{
          if(action.payload.listRoles && action.payload.listRoles.length>0 && action.payload.listRoles[0]==="ADMIN"){
            toast.error("Bạn không có quyền truy cập vào trang này");
            setTimeout(()=>{
              window.location.href = "/admin/dashboard";
            },2000);
          }else{
            state.isLogined = true;
            state.username = action.payload.username;
            state.listRoles = action.payload.listRoles;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.accountId = action.payload.accountId;
            state.ilogins=action.payload;
            state.profilePicture=action.payload.profilePicture;
            state.follower= action.payload.follower;
          state.following= action.payload.following;
          state.upload= action.payload.upload;
          }
        }
      })
      .addCase(ChangePasswordAction.fulfilled, (state) => {
        state.loading = false;
        toast.success("Đổi mật khẩu thành công");
      })
      .addCase(
        SendAuthOtpAction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          toast.success(action.payload);
        }
      )
      .addCase(
        UpdatePasswordAction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.otp = null;
          state.otpExpires = null;
          window.location.href = "/login";
          toast.success(action.payload);
        }
      )
      .addCase(ClearTokenAction.fulfilled, (state) => {
        state.loading = false;
        state.otp = null;
        state.otpExpires = null;
      })
      .addCase(LoginAction.rejected, (state) => {
        state.loading = false;
        state.isLogined = false;
      })

      .addCase(RegisterAction.rejected, (state) => {
        state.loading = false;
        state.isRegister = false;
      })
      .addCase(LogoutAction.rejected, (state, action) => {
        state.loading = false;
        state.isLogined = false;
        toast.error(action.error.message);
        state.Error = action.error.message || "Logout failed";
      })
      .addCase(AutoLoginAction.rejected, (state, action) => {
        // state.loading = false;
        state.isLogined = false;
        state.Error = action.error.message || "Auto login failed";
      })
      .addCase(ChangePasswordAction.rejected, (state) => {
        state.loading = false;
        toast.error("Đổi mật khẩu thất bại");
      })
      .addCase(SendAuthOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.Error = action.error.message || "Send otp failed";
      })
      .addCase(UpdatePasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.Error = action.error.message || "Update new password failed";
      })
      .addCase(ClearTokenAction.rejected, (state, action) => {
        state.loading = false;
        state.Error = action.error.message || "Clear token failed";
      });
  },
});
// eslint-disable-next-line react-refresh/only-export-components
export const {
  userRegister,
  clearState,
  clearStateWhenLogout,
  loginStart,
  loginFailure,
  loginSuccess,
  registerStart,
  registerFailure,
  registerSuccess,
  updateToken,
  logout,
  updateOtpState,
  updateStateLoading,
  updateStateUsername,
  updateFollowing,
  updateFollower,
  updateUpload,
} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;
