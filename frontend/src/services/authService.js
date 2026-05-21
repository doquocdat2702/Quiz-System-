import instance from "../api/axios";

export const login = async (email, password) => {
  try {
    const response = await instance.post("/auth/login", {
      email,
      password
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await instance.post("/auth/register", {
      name,
      email,
      password
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMe = async () => {
  try {
    const response = await instance.get("/auth/me");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (profile) => {
  try {
    const response = await instance.put("/auth/me", profile);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuizzes = async () => {
  try {
    const response = await instance.get("/quizzes");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuizById = async (id) => {
  try {
    const response = await instance.get(`/quizzes/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuizByCode = async (code) => {
  try {
    const response = await instance.get(`/quizzes/code/${code}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQuizForEdit = async (id) => {
  try {
    const response = await instance.get(`/quizzes/${id}/edit`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createQuiz = async (quiz) => {
  try {
    const response = await instance.post("/quizzes", quiz);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateQuiz = async (id, quiz) => {
  try {
    const response = await instance.put(`/quizzes/${id}`, quiz);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteQuiz = async (id) => {
  try {
    const response = await instance.delete(`/quizzes/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const submitQuiz = async (quizId, answers) => {
  try {
    const response = await instance.post(`/quizzes/${quizId}/submit`, {
      answers
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getHistory = async () => {
  try {
    const response = await instance.get("/history");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAttemptById = async (attemptId) => {
  try {
    const response = await instance.get(`/history/${attemptId}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
