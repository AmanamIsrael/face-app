import { ResultComment } from "./ResultComment";

interface ImageResultsProps {
  results?: {
    [key: string]: string;
  };
}

export const ImageResults = (props: ImageResultsProps) => {
  const comment = props.results ? props.results["comment"] : "No comment";

  return (
    <section className="grid gap-2">
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(props.results || []).map((key, index) => (
          <ResultComment
            key={index}
            title={key}
            comment={props.results ? props.results[key] : "_"}
          />
        ))}
      </div>

      {/* comment */}
      {Object.keys(props.results || []).length > 0 && (
        <ResultComment title="Comment" comment={comment} />
      )}
    </section>
  );
};
