import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import UsuarioCard from "../src/components/UsuarioCard";
import UsuarioSearch from "../src/components/UsuarioSearch";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Shared test data
const mockUsuario = {
  id: 1,
  nombre: "Carlos García",
  email: "carlos@example.com",
  numeroParcelas: 3,
  imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Carlos",
  password: "hashed_password",
};

const mockUsuarios = [
  {
    id: 1,
    nombre: "Carlos García",
    email: "carlos@example.com",
    profile: {
      imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Carlos",
    },
    _count: { parcelas: 3 },
    password: "hashed_password",
  },
  {
    id: 2,
    nombre: "María López",
    email: "maria@example.com",
    profile: {
      imagen: "https://api.dicebear.com/9.x/lorelei/svg?seed=Maria",
    },
    _count: { parcelas: 0 },
    password: "hashed_password",
  },
  {
    id: 3,
    nombre: "Pedro Martínez",
    email: "pedro@example.com",
    profile: null,
    _count: { parcelas: 1 },
    password: "hashed_password",
  },
];

// Test 1 — UsuarioCard renders correct data
// and does not expose sensitive information

describe("UsuarioCard", () => {
  it("renders nombre, email and parcela count correctly", () => {
    render(<UsuarioCard {...mockUsuario} />);

    expect(screen.getByText("Carlos García")).toBeInTheDocument();
    expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
    expect(screen.getByText(/3 parcelas/i)).toBeInTheDocument();
  });

  it("renders profile image with correct alt text when imagen is provided", () => {
    render(<UsuarioCard {...mockUsuario} />);

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Foto de perfil de Carlos García");
  });

  it("renders initial letter avatar when no profile image is provided", () => {
    render(<UsuarioCard {...mockUsuario} imagen={undefined} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("does not render sensitive user data such as password", () => {
    render(<UsuarioCard {...mockUsuario} />);

    expect(screen.queryByText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hashed_password/i)).not.toBeInTheDocument();
  });

  it("displays singular parcela label when user has one parcela", () => {
    render(<UsuarioCard {...mockUsuario} numeroParcelas={1} />);

    expect(screen.getByText(/1 parcela$/i)).toBeInTheDocument();
  });
});

// Test 2 — UsuarioCard navigates on click

describe("UsuarioCard navigation", () => {
  it("navigates to the correct user map route when clicked", () => {
    render(<UsuarioCard {...mockUsuario} />);

    fireEvent.click(screen.getByText("Carlos García"));

    expect(mockPush).toHaveBeenCalledWith("/user/1");
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});

// Test 3 — UsuarioSearch renders initial data

describe("UsuarioSearch", () => {
  it("renders the correct number of user cards from initial data", () => {
    render(<UsuarioSearch initialUsuarios={mockUsuarios} />);

    expect(screen.getByText("Carlos García")).toBeInTheDocument();
    expect(screen.getByText("María López")).toBeInTheDocument();
    expect(screen.getByText("Pedro Martínez")).toBeInTheDocument();
  });

  it("renders search input and filter buttons", () => {
    render(<UsuarioSearch initialUsuarios={mockUsuarios} />);

    expect(
      screen.getByPlaceholderText(/buscar por nombre o email/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Todos")).toBeInTheDocument();
    expect(screen.getByText("Con parcelas")).toBeInTheDocument();
    expect(screen.getByText("Sin parcelas")).toBeInTheDocument();
  });

  it("shows correct result count", () => {
    render(<UsuarioSearch initialUsuarios={mockUsuarios} />);

    expect(screen.getByText(/3 usuarios encontrados/i)).toBeInTheDocument();
  });
});
