
type Props = {
    onClick: () => void;
};

export default function EditButton({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick}>
            sunting
        </button>
    );
}
