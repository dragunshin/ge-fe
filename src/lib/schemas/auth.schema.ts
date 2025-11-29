import { z } from 'zod';

// 이메일 검증 스키마
const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.');

// 비밀번호 검증 스키마
const passwordSchema = z
  .string()
  .min(1, '비밀번호를 입력해주세요.')
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
  );

// 로그인 스키마
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'), // 로그인 시에는 형식 검증 완화
});

// 회원가입 스키마 (나중에 사용)
export const signupSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(10, '닉네임은 최대 10자까지 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9]+$/, '닉네임은 한글, 영문, 숫자만 사용 가능합니다.'),
    birth: z
      .string()
      .min(1, '생년월일을 입력해주세요.')
      .regex(/^\d{8}$/, '생년월일은 8자리 숫자로 입력해주세요. (예: 19980101)')
      .refine((val) => {
        const year = parseInt(val.substring(0, 4));
        const month = parseInt(val.substring(4, 6));
        const day = parseInt(val.substring(6, 8));
        return year >= 1900 && year <= new Date().getFullYear() &&
               month >= 1 && month <= 12 &&
               day >= 1 && day <= 31;
      }, {
        message: '올바른 날짜를 입력해주세요.',
      }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    userType: z.string().min(1, '사용자 유형을 선택해주세요.'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관에 동의해야 합니다.',
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해야 합니다.',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// 소셜 로그인 스키마
export const socialLoginSchema = z.object({
  code: z.string().min(1, '인가 코드가 필요합니다.'),
  provider: z.enum(['KAKAO'], {
    message: '지원하지 않는 소셜 로그인 제공자입니다.',
  }),
});

// 소셜 회원가입 스키마
export const socialSignupSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요.')
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(10, '닉네임은 최대 10자까지 가능합니다.')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '닉네임은 한글, 영문, 숫자만 사용 가능합니다.'),
  birth: z
    .string()
    .min(1, '생년월일을 입력해주세요.')
    .regex(/^\d{8}$/, '생년월일은 8자리 숫자로 입력해주세요. (예: 19980101)')
    .refine((val) => {
      const year = parseInt(val.substring(0, 4));
      const month = parseInt(val.substring(4, 6));
      const day = parseInt(val.substring(6, 8));
      return year >= 1900 && year <= new Date().getFullYear() &&
             month >= 1 && month <= 12 &&
             day >= 1 && day <= 31;
    }, {
      message: '올바른 날짜를 입력해주세요.',
    }),
  email: emailSchema,
  userType: z.string().min(1, '사용자 유형을 선택해주세요.'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: '서비스 이용약관에 동의해야 합니다.',
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: '개인정보 처리방침에 동의해야 합니다.',
  }),
});

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type SocialLoginFormData = z.infer<typeof socialLoginSchema>;
export type SocialSignupFormData = z.infer<typeof socialSignupSchema>;
