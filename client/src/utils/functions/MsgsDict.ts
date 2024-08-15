export const msgsDict = (
  type?: 'network' | 'form' | 'email' | 'password' | 'min',
  num: number = 3,
): string => {
  switch (type) {
    case 'network':
      return 'An unexpected error occurred, please try again later';
    case 'form':
      return 'Incorrect information, please check the highlighted fields';
    case 'min':
      return `Must have at least ${num} character${num > 1 ? 's' : ''}`;
    case 'password':
      return 'Insecure password';
    case 'email':
      return 'Invalid email';
    default:
      return 'Required';
  }
};
