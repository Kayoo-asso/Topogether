type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;

export const readFileAsync = (file: File) => new Promise((resolve: PromiseResolve<string | ArrayBuffer | null>) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(file);
});
