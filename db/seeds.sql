INSERT INTO departments (dep_name)
VALUES  ("HR"),
        ("IT"),
        ("R&D"),
        ("Production");

INSERT INTO roles (title, salary, department_id)
VALUES  ("HR Generalist", 75000, 1),
        ("IT Manager", 70000, 2),
        ("Research Scientist", 90000, 3),
        ("Production Manager", 65000, 4),
        ("Lab Technician", 50000, 3),
        ("Production Associate", 45000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Paul", "Coffey", 4, NULL),
        ("Octavious", "Moore", 6, 4);