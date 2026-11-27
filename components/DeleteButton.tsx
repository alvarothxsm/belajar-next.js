
type Props = {
    onClick: () => void;
};

export default function DeleteButton({ onClick }: Props) {
    return (
        <button type="button" onClick={onClick}>
            delete
        </button>
    );
}

