interface ResultCommentProps {
  title: string;
  comment: string;
}

export const ResultComment = (props: ResultCommentProps) => {
  return (
    <div className="flex w-full flex-col gap-4 p-4 rounded-xl border">
      {/* title */}
      <p className="text-sm font-light text-primary">{props.title}</p>
      {/* Body */}
      <span className="text-xl font-semibold">{props.comment}</span>
    </div>
  );
};
